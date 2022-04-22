require 'sinatra'
require 'json'
require 'logger'
require 'uri'

logger = Logger.new(STDOUT)

basedir = ENV['BASEDIR']
if basedir == '' then
    abort '$BASEDIR must be set'
end

`cd #{basedir} && mkdir -p db/visitor-counter/`

db = nil
db_path = basedir + '/db/visitor-counter/visits.json'

if File.file? db_path then
    db_file = File.read(db_path)
    db = JSON.parse(db_file)
else
    db = {}
end

thr = Thread.new {
    loop do
        File.open(db_path, 'w') { |file| file.write db.to_json }
        logger.info "Saved DB to #{db_path}"

        sleep 30
    end
}

get '/*' do
    # /https://zachlatta.co/asdf -> https://zachlatta.com/asdf
    #
    # removes leading / character added by sinatra
    path_requested = request.path_info[1..-1]

    # nginx, during the reverse proxy process, will convert:
    #
    #   https://zachlatta.com/visitor-counter/https://zachlatta.com
    #
    # to
    #
    #   https://zachlatta.com/visitor-counter/https:/zachlatta.com
    #
    # notice that removed / near the end of the second example. this hack fixes
    # that where it breaks the HTTP and HTTPS protocol section
    #
    path_requested.gsub!('https:/', 'https://')
    path_requested.gsub!('http:/', 'http://')

    uri = URI(path_requested)
    if uri.host == nil || uri.path == nil then
        status 422
        body "Invalid URL passed: #{path_requested}"
        return
    end

    url_to_log = uri.host + uri.path

    db[url_to_log] ||= 0
    db[url_to_log] += 1

    format_number(db[url_to_log])
end

# 1234567 -> 1,234,567
def format_number(number)
    num_groups = number.to_s.chars.to_a.reverse.each_slice(3)
    num_groups.map(&:join).join(',').reverse
end